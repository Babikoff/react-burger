import type { JSX } from 'react';

import type { IFeedStat } from '@/services/api-types';

//import styles from './feed-stat.module.css';

interface IFeedStatProps {
  feedStat?: IFeedStat;
}

function FeedStat({ feedStat }: IFeedStatProps): JSX.Element {
  return <div>Статистика заказов. Всего: {feedStat?.total}</div>;
}

export default FeedStat;
