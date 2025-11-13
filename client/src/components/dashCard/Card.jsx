// src/components/Card/Card.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './Card.scss'; // Or Card.module.scss if using CSS Modules

const Card = ({ title, value, icon: IconComponent, className }) => {
  return (
    <div className={`card ${className || ''}`}>
      {IconComponent && (
        <div className="card__icon-wrapper">
          <IconComponent className="card__icon" />
        </div>
      )}
      <div className="card__content">
        <div className="card__value">{value}</div>
        <div className="card__title">{title}</div>
      </div>
    </div>
  );
};

// Prop types for documentation and validation
Card.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType, // Expecting a component type like FaUsers
  className: PropTypes.string,
};

// Default props (optional)
Card.defaultProps = {
  icon: null,
  className: '',
};

export default Card;