import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Header, Segment, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Loader } from '@components/Loader';
import { Error } from '@components/Error';
import { loanApi } from '@api/loan';
import { invenioConfig } from '@config';
import { BackOfficeRoutes } from '@routes/urls';
import { dateFormatter } from '@api/date';
import { SeeAllButton } from '@components/backoffice/buttons/SeeAllButton';

export default class ItemPastLoans extends Component {
  componentDidMount() {
    const {
      itemDetails: { pid },
      fetchPastLoans,
    } = this.props;
    fetchPastLoans(pid);
  }

  seeAllButton = () => {
    const {
      itemDetails: { pid },
    } = this.props;
    const loanStates = invenioConfig.circulation.loanCompletedStates;
    const path = BackOfficeRoutes.loansListWithQuery(
      loanApi
        .query()
        .withItemPid(pid)
        .withState(loanStates)
        .qs()
    );
    return <SeeAllButton to={path} />;
  };

  viewDetails = ({ row }) => {
    return (
      <Button
        as={Link}
        to={BackOfficeRoutes.loanDetailsFor(row.metadata.pid)}
        compact
        icon="info"
        data-test={row.metadata.pid}
      />
    );
  };

  renderNoPastLoans = () => {
    return (
      <Message info icon data-test="no-results">
        <Message.Content>
          <Message.Header>No loans history</Message.Header>
          There are no past loans for this item.
        </Message.Content>
      </Message>
    );
  };

  renderTable() {
    const { data, showMaxPastLoans } = this.props;
    const columns = [
      { title: '', field: '', formatter: this.viewDetails },
      { title: 'ID', field: 'metadata.pid' },
      { title: 'Patron ID', field: 'metadata.patron.name' },
      { title: 'State', field: 'metadata.state' },
      {
        title: 'Start date',
        field: 'metadata.start_date',
        formatter: dateFormatter,
      },
      {
        title: 'End date',
        field: 'metadata.end_date',
        formatter: dateFormatter,
      },
      { title: 'Renewals', field: 'metadata.extension_count' },
    ];

    return (
      <>
        <Header as="h3" attached="top" id="loans-history">
          Loans history
        </Header>
        <Segment attached="bottom" className="bo-metadata-segment no-padding">
          <ResultsTable
            data={data.hits}
            columns={columns}
            totalHitsCount={data.total}
            name="loans"
            seeAllComponent={this.seeAllButton()}
            showMaxRows={showMaxPastLoans}
            renderEmptyResultsElement={this.renderNoPastLoans}
          />
        </Segment>
      </>
    );
  }

  render() {
    const { isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>{this.renderTable()}</Error>
      </Loader>
    );
  }
}

ItemPastLoans.propTypes = {
  itemDetails: PropTypes.object.isRequired,
  fetchPastLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxPastLoans: PropTypes.number,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
};

ItemPastLoans.defaultProps = {
  showMaxPastLoans: 5,
  isLoading: false,
  error: {},
};
