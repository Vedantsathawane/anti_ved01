import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page page-center">
      <div className="not-found">
        <div className="not-found-num">404</div>
        <h2>Page Not Found</h2>
        <p>
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" id="notfound-home-btn" onClick={() => navigate('/')}>
            🏠 Go Home
          </button>
          <button className="btn btn-secondary btn-lg" id="notfound-back-btn" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
