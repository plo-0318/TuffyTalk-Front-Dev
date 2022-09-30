import PostItem from './PostItem';

import commonClasses from '../../../utils/common.module.css';
import classes from './Posts.module.css';

const Posts = (props) => {
  const contentNoPosts = (
    <div className={classes['no_content-container']}>
      <p>There are no posts for the this topic</p>
      <p>Be the first one to post 😎</p>
    </div>
  );

  const contentHavePosts = props.postData.map((post) => (
    <PostItem key={post._id} post={post} />
  ));

  return (
    <article
      style={{ width: '100%' }}
      className={`${commonClasses['main-container']} ${commonClasses['center-margin_bottom']} ${classes['posts-container']}}`}
    >
      {props.postData.length > 0 ? contentHavePosts : contentNoPosts}
    </article>
  );
};

export default Posts;
