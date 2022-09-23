import MainHeader from './main_page_header/MainHeader';
import CreatePost from './create_post/CreatePost';
import Posts from './posts/Posts';
import TopicList from './topic_list/TopicList';

import classes from './MainPage.module.css';

const MainPage = () => {
  return (
    <main className={classes['main_page-container']}>
      <TopicList />
      <div className={classes['main_page__content-container']}>
        <MainHeader />
        <CreatePost />
        <Posts />
      </div>
    </main>
  );
};

export default MainPage;
