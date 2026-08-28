export function isTokenExists(): boolean {
  return !!localStorage.getItem('accessToken');
}
