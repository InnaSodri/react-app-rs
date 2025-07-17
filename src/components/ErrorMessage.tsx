import React from 'react';

interface Props {
  message: string;
}

export class ErrorMessage extends React.Component<Props> {
  render() {
    return (
      <div>
        <h3>Error</h3>
        <p>{this.props.message}</p>
      </div>
    );
  }
}
