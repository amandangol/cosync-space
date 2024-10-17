// Label.js
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Label = ({ htmlFor, children, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={classNames('block text-sm font-medium text-gray-700', className)}
    >
      {children}
    </label>
  );
};

Label.propTypes = {
  htmlFor: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Label.defaultProps = {
  htmlFor: '',
  className: '',
};

export default Label;
