import classes from './ErrorPage.module.css';

const ErrorPage = (props) => {
  const msg = props.message || 'Woops, Invalid Page 😢';

  return (
    <div className={classes['no_content_found-container']}>
      <p>{msg}</p>
    </div>
  );
};

export default ErrorPage;
