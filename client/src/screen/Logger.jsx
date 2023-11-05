import React from "react";

const Logger = () => {
  return (
    <React.Fragment>
      <div className="screen">
        <div className="center-content">
          <button type="button" className="btn btn-primary">
            Primary
          </button>
          <table>{/* Add your table content here */}</table>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Logger;
