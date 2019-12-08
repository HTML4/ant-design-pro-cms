import React from 'react';
import { message, Alert } from 'antd';

let clearMessage = '';

export const messageAlert = function messageAlert(data) {
  if (clearMessage) {
    setTimeout(clearMessage, 0);
  }
  clearMessage = message.info(
    <Alert
      className="f-tal"
      message={data.message}
      description={data.description}
      type={data.status}
      showIcon
    />,
    data.duration || 3,
  );
};
