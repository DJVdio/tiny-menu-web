import React from 'react';
import { API_BASE_URL } from '../config/api';

const EnvTest: React.FC = () => {
  const envVars = {
    'NODE_ENV': process.env.NODE_ENV,
    'REACT_APP_API_BASE_URL': process.env.REACT_APP_API_BASE_URL,
    'API_BASE_URL (from config)': API_BASE_URL,
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>环境变量测试页面</h1>
      <h2>当前环境配置：</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '800px' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>变量名</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>值</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(envVars).map(([key, value]) => (
            <tr key={key}>
              <td style={{ border: '1px solid #ddd', padding: '12px', fontWeight: 'bold' }}>{key}</td>
              <td style={{ border: '1px solid #ddd', padding: '12px', color: '#0066cc' }}>{value || 'undefined'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: '30px' }}>所有 REACT_APP_ 环境变量：</h2>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
        {JSON.stringify(
          Object.keys(process.env)
            .filter(key => key.startsWith('REACT_APP_'))
            .reduce((obj: any, key) => {
              obj[key] = process.env[key];
              return obj;
            }, {}),
          null,
          2
        )}
      </pre>

      <h2 style={{ marginTop: '30px' }}>测试结果：</h2>
      <div style={{ background: API_BASE_URL.includes('localhost') ? '#d4edda' : '#fff3cd', padding: '15px', borderRadius: '5px', border: '1px solid #ccc' }}>
        {API_BASE_URL.includes('localhost') ? (
          <div>
            <h3 style={{ color: '#155724', margin: 0 }}>✅ 开发环境配置正确</h3>
            <p style={{ margin: '10px 0 0 0' }}>API 地址指向本地后端: {API_BASE_URL}</p>
          </div>
        ) : (
          <div>
            <h3 style={{ color: '#856404', margin: 0 }}>⚠️ 生产环境配置</h3>
            <p style={{ margin: '10px 0 0 0' }}>API 地址指向生产后端: {API_BASE_URL}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnvTest;
