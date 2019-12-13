import React from 'react'
import PropTypes from 'prop-types';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

const { Option } = Select;

class SearchSelect extends React.Component {
  constructor(props) {
    super(props);
    this.fetchResource = debounce(this.fetchResource, 800);
  }

  state = {
    data: [],
    value: [],
    fetching: false,
  };

  fetchResource = value => {
    this.setState({ data: [], fetching: true });
    fetch(`/api/${this.props.resourceName}?keyword=${value}`)
      .then(response => response.json())
      .then(body => {
        const data = body.data.map(this.props.mapper);
        this.setState({ data, fetching: false });
      });
  };

  handleChange = value => {
    this.setState({
      value,
      data: [],
      fetching: false,
    });
    this.props.onSelect(value)
  };

  render() {
    const { fetching, data, value } = this.state;
    return (
      <Select
        mode="multiple"
        labelInValue
        value={value}
        placeholder={this.props.placeholder || '请选择'}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchResource}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {data.map(d => (
          <Option key={d.value}>{d.text}</Option>
        ))}
      </Select>
    );
  }
}

SearchSelect.propTypes = {
  mapper: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  resourceName: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

export default SearchSelect
