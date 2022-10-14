import TopicList from '../main_page/topic_list/TopicList';

import classes from './SearchResult.module.css';
import commonClasses from '../../utils/common.module.css';

const SearchResult = () => {
  return (
    <div className={classes['search_result_page-container']}>
      <TopicList />
      <div
        className={`${commonClasses['main-container']} ${classes['search_result-container']}`}
      ></div>
    </div>
  );
};

export default SearchResult;
