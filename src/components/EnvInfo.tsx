import React from 'react';
import { API_BASE_URL } from '../config/api';
import './EnvInfo.css';

const EnvInfo: React.FC = () => {
  return (
    <div className="env-info">
      <div className="env-badge">
        <span className="env-label">环境:</span>
        <span className="env-value">{process.env.NODE_ENV}</span>
      </div>
      <div className="env-badge">
        <span className="env-label">API:</span>
        <span className="env-value">{API_BASE_URL}</span>
      </div>
    </div>
  );
};

export default EnvInfo;
