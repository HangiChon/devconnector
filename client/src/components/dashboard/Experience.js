import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import { deleteExperience } from '../../actions/profile';

const Experience = ({ experience, deleteExperience }) => {
  const experiences = experience.map(exp => (
    <tr key={exp.id}>
      <td>{exp.company}</td>
      <td className='hide-sm'>{exp.title}</td>
      <td>
        <Moment format='YYYY/MM/DD'>{exp.from}</Moment> -{' '}
        {exp.to === '' ? (
          ' Present'
        ) : (
          <Moment format='YYYY/MM/DD'>{exp.to}</Moment>
        )}
      </td>
      <td>
        <button
          onClick={() => deleteExperience(exp._id)} // Note exp._id as per endpoint, not exp.id
          className='btn btn-danger'
        >
          Delete
        </button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className='my-2 list-title'>List of Experience</h2>
      <table className='table'>
        <thead>
          <tr>
            <th className='where'>Company</th>
            <th className='hide-sm what'>Title</th>
            <th className='hide-sm when'>Years</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </Fragment>
  );
};

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired
};

export default connect(null, { deleteExperience })(Experience);
