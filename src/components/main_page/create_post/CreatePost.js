import classes from './CreatePost.module.css';
import commonClasses from '../../../utils/common.module.css';
import userImage from '../../../img/placeholder/user-placeholder.png';

const CreatePost = () => {
  return (
    <div
      className={`${commonClasses['main-container']} ${commonClasses['center-margin_bottom']} ${classes['create_post__main-container']}`}
    >
      <div className={classes['create_post-container']}>
        <img src={userImage} alt='User' />
        <button>Share something...</button>
      </div>
    </div>
  );
};

export default CreatePost;
