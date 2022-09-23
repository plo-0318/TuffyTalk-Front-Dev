import PostItem from './PostItem';

import commonClasses from '../../../utils/common.module.css';
import classes from './Posts.module.css';
import userImg from '../../../img/placeholder/user-placeholder.png';
import postImg from '../../../img/placeholder/topic-placeholder.png';

// username, gender, profilePic, title, content, createdAt, likes, comments, img

const content =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id ornare arcu odio ut sem nulla pharetra. Id consectetur purus ut faucibus. Sed adipiscing diam donec adipiscing tristique. Magna ac placerat vestibulum lectus mauris ultrices eros in. Arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales. Vel pretium lectus quam id leo. Porttitor rhoncus dolor purus non enim praesent elementum facilisis leo.';

const DUMMY = [
  {
    username: 'cece',
    gender: 'female',
    profilePic: userImg,
    title: 'This is a post title',
    content,
    createdAt: '2022-9-20',
    likes: 78,
    comments: ['123', '456', '789'],
    postImg,
  },
  {
    username: 'dodo',
    gender: 'male',
    profilePic: userImg,
    title: 'This is a another another post',
    content,
    createdAt: '2022-10-20',
    likes: 128,
    comments: ['123', '456', '789', '122', '666'],
    postImg,
  },
  {
    username: 'sharoon',
    gender: 'female',
    profilePic: userImg,
    title:
      'This is a another another post with a really really really really really really really really long title',
    content,
    createdAt: '2022-10-20',
    likes: 4,
    comments: [],
    postImg: null,
  },
  {
    username: 'cece1',
    gender: 'female',
    profilePic: userImg,
    title: 'This is a post title',
    content,
    createdAt: '2022-9-20',
    likes: 78,
    comments: ['123', '456', '789'],
    postImg,
  },
  {
    username: 'dodo1',
    gender: 'male',
    profilePic: userImg,
    title: 'This is a another another post',
    content,
    createdAt: '2022-10-20',
    likes: 128,
    comments: ['123', '456', '789', '122', '666'],
    postImg,
  },
  {
    username: 'sharoon1',
    gender: 'female',
    profilePic: userImg,
    title:
      'This is a another another post with a really really really really really really really really long title',
    content,
    createdAt: '2022-10-20',
    likes: 4,
    comments: [],
    postImg: null,
  },
];

const Posts = (props) => {
  return (
    <article
      className={`${commonClasses['main-container']} ${classes['posts-container']}`}
    >
      {DUMMY.map((post) => (
        <PostItem key={post.username} post={post} />
      ))}
    </article>
  );
};

export default Posts;
