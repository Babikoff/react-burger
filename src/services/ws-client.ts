/**
 * WebSocketClient — переиспользуемый класс для управления WebSocket-соединениями
 * с поддержкой переподключения и обновления токена.
 *
 * Предоставляет колбэки onMessage, onError, onConnectionChange,
 * которые можно переопределять для каждого эндпоинта.
 */

export interface IWebSocketClientConfig {
  /** URL WebSocket-сервера (без токена в query-параметрах) */
  url: string;

  /** Функция tokenGetter - извлекает из хранилища и предоставляет классу текущий токен.
   * @returns {string | null | undefined}
   */
  tokenGetter: () => string | null | undefined;

  /** Функция tokenRefresher - обновляет токен, если класс обнаружил, что token устарел */
  tokenRefresher: () => Promise<unknown> | null | undefined;

  /** Пауза между попытками переподключения в мс */
  reconnectPeriod?: number;
}

export class WebSocketClient {
  private socket: WebSocket | null = null;
  private readonly url: string;
  private readonly tokenGetter: () => string | null | undefined;
  private readonly tokenRefresher: () => Promise<unknown> | null | undefined;
  private readonly reconnectPeriod: number;
  private reconnectTimerId: ReturnType<typeof setTimeout> | null = null;
  private isDisposed = false;
  private isConnected = false;

  // Публичные callback-и

  /** Вызывается при каждом полученном сообщении */
  onMessage: ((data: unknown) => void) | null = null;

  /** Вызывается при каждом полученном сообщении, чтобы проверить не является ли
   * оно сообщением о необходимости обновления токена.
   */
  onCheckIfTokenExpiredMessage: ((message: unknown) => boolean) | null = null;

  /** Вызывается при ошибке соединения */
  onError: ((error: Event, message?: string) => void) | null = null;

  /** Вызывается при изменении состояния соединения */
  onConnectionChange: ((connected: boolean) => void) | null = null;

  constructor(config: IWebSocketClientConfig) {
    this.url = config.url;
    this.tokenGetter = config.tokenGetter;
    this.tokenRefresher = config.tokenRefresher;
    this.reconnectPeriod = config.reconnectPeriod ?? 3000;
  }

  /**
   * Устанавливает соединение.
   * Если соединение уже открыто, сначала закрывает его.
   */
  connect(): void {
    this.cleanupReconnectTimer();

    const accessToken = this.tokenGetter();
    const token = accessToken?.replace('Bearer ', '');

    try {
      let url = this.url;
      if (token) url += `?token=${token}`;
      this.socket = new WebSocket(url);
    } catch (error) {
      console.error('WebSocketClient: socket creation error:', error, new Date());
      this.scheduleReconnect();
      return;
    }

    this.socket.onopen = (): void => {
      this.isConnected = true;
      this.onConnectionChange?.(true);
    };

    this.socket.onmessage = (event: MessageEvent): void => {
      let data: Record<string, unknown>;
      try {
        data = JSON.parse(event.data) as Record<string, unknown>;
      } catch {
        console.error(
          'WebSocketClient: could not parse reseived message.',
          event.data,
          new Date()
        );
        return;
      }

      // Если задана функция проверки сообщения, то просим клиента проверить
      // не означает ли оно, что нужно обновить токен.
      if (
        this.onCheckIfTokenExpiredMessage &&
        this.onCheckIfTokenExpiredMessage(data.message)
      ) {
        // Если токен протух — обновляем и переподключаемся
        this.refreshTokenAndReconnect();
        return;
      }

      this.onMessage?.(data);
    };

    this.socket.onclose = (): void => {
      this.isConnected = false;
      this.onConnectionChange?.(false);

      if (!this.isDisposed) {
        console.log(
          'WebSocketClient: connection is closed. Scheduling reconnect.',
          new Date()
        );
        this.scheduleReconnect();
      }
    };

    this.socket.onerror = (event: Event): void => {
      const message =
        event instanceof ErrorEvent
          ? event.message
          : 'Произошла ошибка WebSocket соединения.';
      console.error('WebSocketClient: connection error:', message, new Date());

      if (!this.isConnected) {
        this.onError?.(event, message);
      }
    };
  }

  /** Закрывает текущее соединение без переподключения. */
  disconnect(): void {
    console.log('Disconnecting WebSocket.', new Date());
    this.cleanupReconnectTimer();
    this.socket?.close();
    this.socket = null;
    this.isConnected = false;
    this.onConnectionChange?.(false);
  }

  /**
   * Очистка ресурсов.
   * После вызова dispose клиент больше не может быть использован.
   */
  dispose(): void {
    this.isDisposed = true;
    this.disconnect();
    this.onMessage = null;
    this.onError = null;
    this.onConnectionChange = null;
  }

  private scheduleReconnect(): void {
    if (this.isDisposed) {
      return;
    }

    console.log(`WebSocketClient: reconnect in ${this.reconnectPeriod} ms.`, new Date());
    this.reconnectTimerId = setTimeout(() => {
      this.reconnectTimerId = null;
      this.connect();
    }, this.reconnectPeriod);
  }

  private cleanupReconnectTimer(): void {
    if (this.reconnectTimerId !== null) {
      clearTimeout(this.reconnectTimerId);
      this.reconnectTimerId = null;
    }
  }

  private async refreshTokenAndReconnect(): Promise<void> {
    if (!this.tokenRefresher) {
      console.warn('tokenRefresher is not set', new Date());
      return;
    }

    console.log('WebSocketClient: starting token refreshing', new Date());
    try {
      await this.tokenRefresher();

      // После обновления токена закрываем старое соединение и открываем новое
      this.cleanupReconnectTimer();
      this.socket?.close();
      this.socket = null;
      this.connect();
    } catch (error) {
      console.error('WebSocketClient: could not update token:', error, new Date());

      // Попытаемся переподключиться позже
      this.scheduleReconnect();
    }
  }
}
