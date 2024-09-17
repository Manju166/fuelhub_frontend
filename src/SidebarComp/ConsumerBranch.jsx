import React from 'react';
import { useParams } from 'react-router-dom';

function CustomerBranch() {
  const { id } = useParams(); // Get the consumer ID from the URL params

  return (
    <div>
      <h1>Customer Branch for Consumer ID: {id}</h1>
      {/* Fetch and display branch details for this consumer */}
    </div>
  );
}

export default CustomerBranch;
