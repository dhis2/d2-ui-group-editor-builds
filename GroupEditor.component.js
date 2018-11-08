import _Array$from from 'babel-runtime/core-js/array/from';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import Paper from 'material-ui/Paper/Paper';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';

// D2
import { config } from 'd2';

// D2-UI
import { CircularProgress } from '@dhis2/d2-ui-core';

// TODO: TOAST!
// TODO: Undo support (in TOAST?)

config.i18n.strings.add('selected');
config.i18n.strings.add('assign_all');
config.i18n.strings.add('remove_all');
config.i18n.strings.add('hidden_by_filters');

var GroupEditor = function (_Component) {
    _inherits(GroupEditor, _Component);

    function GroupEditor(props, context) {
        _classCallCheck(this, GroupEditor);

        var _this = _possibleConstructorReturn(this, (GroupEditor.__proto__ || _Object$getPrototypeOf(GroupEditor)).call(this, props, context));

        _this.state = {
            // Number of items selected in the left/right columns
            selectedLeft: 0,
            selectedRight: 0,

            // Loading
            loading: true
        };

        _this.onAssignItems = function () {
            _this.setState({ loading: true });
            _this.props.onAssignItems([].map.call(_this.leftSelect.selectedOptions, function (item) {
                return item.value;
            })).then(function () {
                _this.clearSelection();
                _this.setState({ loading: false });
            }).catch(function () {
                _this.setState({ loading: false });
            });
        };

        _this.onRemoveItems = function () {
            _this.setState({ loading: true });
            _this.props.onRemoveItems([].map.call(_this.rightSelect.selectedOptions, function (item) {
                return item.value;
            })).then(function () {
                _this.clearSelection();
                _this.setState({ loading: false });
            }).catch(function () {
                _this.setState({ loading: false });
            });
        };

        _this.onAssignAll = function () {
            _this.setState({ loading: true });
            _this.props.onAssignItems([].map.call(_this.leftSelect.options, function (item) {
                return item.value;
            })).then(function () {
                _this.clearSelection();
                _this.setState({ loading: false });
            }).catch(function () {
                _this.setState({ loading: false });
            });
        };

        _this.onRemoveAll = function () {
            _this.setState({ loading: true });
            _this.props.onRemoveItems([].map.call(_this.rightSelect.options, function (item) {
                return item.value;
            })).then(function () {
                _this.clearSelection();
                _this.setState({ loading: false });
            }).catch(function () {
                _this.setState({ loading: false });
            });
        };

        _this.byAssignedItemsOrder = function (left, right) {
            var assignedItemStore = _this.props.assignedItemStore.state;

            // Don't order anything if the assignedItemStore is not an array
            // TODO: Support sorting for a ModelCollectionProperty
            if (!Array.isArray(assignedItemStore)) {
                return 0;
            }

            return assignedItemStore.indexOf(left.value) > assignedItemStore.indexOf(right.value) ? 1 : -1;
        };

        var i18n = _this.context.d2.i18n;
        _this.getTranslation = i18n.getTranslation.bind(i18n);
        return _this;
    }

    _createClass(GroupEditor, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this.disposables = [];

            this.disposables.push(this.props.itemStore.subscribe(function (state) {
                return _this2.setState({ loading: !state });
            }));
            this.disposables.push(this.props.assignedItemStore.subscribe(function () {
                return _this2.forceUpdate();
            }));
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(props) {
            if (props.hasOwnProperty('filterText') && this.leftSelect && this.rightSelect) {
                this.setState({
                    selectedLeft: [].filter.call(this.leftSelect.selectedOptions, function (item) {
                        return item.text.toLowerCase().indexOf(('' + props.filterText).trim().toLowerCase()) !== -1;
                    }).length,
                    selectedRight: [].filter.call(this.rightSelect.selectedOptions, function (item) {
                        return item.text.toLowerCase().indexOf(('' + props.filterText).trim().toLowerCase()) !== -1;
                    }).length
                });
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.disposables.forEach(function (disposable) {
                disposable.unsubscribe();
            });
        }

        //
        // Event handlers
        //

    }, {
        key: 'getItemStoreIsCollection',


        //
        // Data handling utility functions
        //
        value: function getItemStoreIsCollection() {
            return this.props.itemStore.state !== undefined && typeof this.props.itemStore.state.values === 'function' && typeof this.props.itemStore.state.has === 'function';
        }
    }, {
        key: 'getItemStoreIsArray',
        value: function getItemStoreIsArray() {
            return this.props.itemStore.state !== undefined && this.props.itemStore.state.constructor.name === 'Array';
        }
    }, {
        key: 'getAssignedItemStoreIsCollection',
        value: function getAssignedItemStoreIsCollection() {
            return this.props.assignedItemStore.state !== undefined && typeof this.props.assignedItemStore.state.values === 'function' && typeof this.props.assignedItemStore.state.has === 'function';
        }
    }, {
        key: 'getAssignedItemStoreIsArray',
        value: function getAssignedItemStoreIsArray() {
            return this.props.assignedItemStore.state !== undefined && this.props.assignedItemStore.state.constructor.name === 'Array';
        }
    }, {
        key: 'getAllItems',
        value: function getAllItems() {
            return this.getItemStoreIsCollection() ? _Array$from(this.props.itemStore.state.values()).map(function (item) {
                return { value: item.id, text: item.name };
            }) : this.props.itemStore.state || [];
        }
    }, {
        key: 'getItemCount',
        value: function getItemCount() {
            return this.getItemStoreIsCollection() && this.props.itemStore.state.size || this.getItemStoreIsArray() && this.props.itemStore.state.length || 0;
        }
    }, {
        key: 'getIsValueAssigned',
        value: function getIsValueAssigned(value) {
            return this.getAssignedItemStoreIsCollection() ? this.props.assignedItemStore.state.has(value) : this.props.assignedItemStore.state && this.props.assignedItemStore.state.indexOf(value) !== -1;
        }
    }, {
        key: 'getAssignedItems',
        value: function getAssignedItems() {
            var _this3 = this;

            return this.getAllItems().filter(function (item) {
                return _this3.getIsValueAssigned(item.value);
            });
        }
    }, {
        key: 'getAvailableItems',
        value: function getAvailableItems() {
            var _this4 = this;

            return this.getAllItems().filter(function (item) {
                return !_this4.getIsValueAssigned(item.value);
            });
        }
    }, {
        key: 'getAllItemsFiltered',
        value: function getAllItemsFiltered() {
            return this.filterItems(this.getAllItems());
        }
    }, {
        key: 'getAssignedItemsFiltered',
        value: function getAssignedItemsFiltered() {
            return this.filterItems(this.getAssignedItems());
        }
    }, {
        key: 'getAvailableItemsFiltered',
        value: function getAvailableItemsFiltered() {
            return this.filterItems(this.getAvailableItems());
        }
    }, {
        key: 'getAssignedItemsCount',
        value: function getAssignedItemsCount() {
            return this.getAssignedItems().length;
        }
    }, {
        key: 'getAvailableItemsCount',
        value: function getAvailableItemsCount() {
            return this.getAvailableItems().length;
        }
    }, {
        key: 'getAssignedItemsFilterCount',
        value: function getAssignedItemsFilterCount() {
            return this.getFilterText().length === 0 ? 0 : this.getAssignedItems().length - this.getAssignedItemsFiltered().length;
        }
    }, {
        key: 'getAvailableItemsFilterCount',
        value: function getAvailableItemsFilterCount() {
            return this.getFilterText().length === 0 ? 0 : this.getAvailableItems().length - this.getAvailableItemsFiltered().length;
        }
    }, {
        key: 'getAssignedItemsUnfilteredCount',
        value: function getAssignedItemsUnfilteredCount() {
            return this.getFilterText().length === 0 ? this.getAssignedItemsCount() : this.getAssignedItemsCount() - this.getAssignedItemsFilterCount();
        }
    }, {
        key: 'getAvailableItemsUnfilteredCount',
        value: function getAvailableItemsUnfilteredCount() {
            return this.getFilterText().length === 0 ? this.getAvailableItemsCount() : this.getAvailableItemsCount() - this.getAvailableItemsFilterCount();
        }
    }, {
        key: 'getFilterText',
        value: function getFilterText() {
            return this.props.filterText ? this.props.filterText.trim().toLowerCase() : '';
        }
    }, {
        key: 'getAvailableSelectedCount',
        value: function getAvailableSelectedCount() {
            return Math.max(this.state.selectedLeft, 0);
        }
    }, {
        key: 'getAssignedSelectedCount',
        value: function getAssignedSelectedCount() {
            return Math.max(this.state.selectedRight, 0);
        }
    }, {
        key: 'getSelectedCount',
        value: function getSelectedCount() {
            return Math.max(this.getAvailableSelectedCount(), this.getAssignedSelectedCount());
        }
    }, {
        key: 'getSelectedItems',
        value: function getSelectedItems() {
            return [].map.call(this.rightSelect.selectedOptions, function (item) {
                return item.value;
            });
        }
    }, {
        key: 'clearSelection',
        value: function clearSelection() {
            var left = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var right = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (left) {
                this.leftSelect.selectedIndex = -1;
            }

            if (right) {
                this.rightSelect.selectedIndex = -1;
            }

            this.setState(function (state) {
                return {
                    selectedLeft: left ? 0 : state.selectedLeft,
                    selectedRight: right ? 0 : state.selectedRight
                };
            });
        }
    }, {
        key: 'filterItems',
        value: function filterItems(items) {
            var _this5 = this;

            return items.filter(function (item) {
                return _this5.getFilterText().length === 0 || item.text.trim().toLowerCase().indexOf(_this5.getFilterText()) !== -1;
            });
        }

        //
        // Rendering
        //

    }, {
        key: 'render',
        value: function render() {
            var _this6 = this;

            var filterHeight = this.getFilterText().length > 0 ? 15 : 0;
            var styles = {
                container: {
                    display: 'flex',
                    marginTop: 16,
                    marginBottom: 32,
                    height: this.props.height + 'px'
                },
                left: {
                    flex: '1 0 120px'
                },
                middle: {
                    flex: '0 0 120px',
                    alignSelf: 'center',
                    textAlign: 'center'
                },
                right: {
                    flex: '1 0 120px'
                },
                paper: {
                    width: '100%',
                    height: '100%'
                },
                select: {
                    width: '100%',
                    minHeight: '50px',
                    height: this.props.height - filterHeight + 'px',
                    border: 'none',
                    fontFamily: 'Roboto',
                    fontSize: 13,
                    outline: 'none'
                },
                options: {
                    padding: '.25rem .5rem'
                },
                buttons: {
                    minWidth: '100px',
                    maxWidth: '100px',
                    marginTop: '8px'
                },
                selected: {
                    fontSize: 13,
                    minHeight: '15px',
                    marginTop: '45px',
                    padding: '0 8px'
                },
                status: {
                    marginTop: '8px',
                    minHeight: '60px'
                },
                hidden: {
                    fontSize: 13,
                    color: '#404040',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    width: '100%',
                    background: '#d0d0d0',
                    maxHeight: '15px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }
            };

            var onChangeLeft = function onChangeLeft(e) {
                _this6.clearSelection(false, true);
                _this6.setState({
                    selectedLeft: e.target.selectedOptions.length
                });
            };

            var onChangeRight = function onChangeRight(e) {
                _this6.clearSelection(true, false);
                _this6.setState({
                    selectedRight: e.target.selectedOptions.length
                });
            };

            var hiddenLabel = function hiddenLabel(itemCount) {
                return _this6.getItemCount() > 0 && _this6.getFilterText().length > 0 ? itemCount + ' ' + _this6.getTranslation('hidden_by_filters') : '';
            };

            var selectedLabel = function selectedLabel() {
                return _this6.getSelectedCount() > 0 ? _this6.getSelectedCount() + ' ' + _this6.getTranslation('selected') : '';
            };

            return React.createElement(
                'div',
                { style: styles.container },
                React.createElement(
                    'div',
                    { style: styles.left },
                    React.createElement(
                        Paper,
                        { style: styles.paper },
                        React.createElement(
                            'div',
                            { style: styles.hidden },
                            hiddenLabel(this.getAvailableItemsFilterCount())
                        ),
                        React.createElement(
                            'select',
                            {
                                multiple: true,
                                style: styles.select,
                                onChange: onChangeLeft,
                                ref: function ref(r) {
                                    _this6.leftSelect = r;
                                }
                            },
                            this.getAvailableItemsFiltered().map(function (item) {
                                return React.createElement(
                                    'option',
                                    {
                                        key: item.value,
                                        value: item.value,
                                        onDoubleClick: _this6.onAssignItems,
                                        style: styles.options
                                    },
                                    item.text
                                );
                            })
                        )
                    ),
                    React.createElement(RaisedButton, {
                        label: this.getTranslation('assign_all') + ' ' + (this.getAvailableItemsUnfilteredCount() === 0 ? '' : this.getAvailableItemsUnfilteredCount()) + ' \u2192',
                        disabled: this.state.loading || this.getAvailableItemsUnfilteredCount() === 0,
                        onClick: this.onAssignAll,
                        style: { marginTop: '1rem' },
                        secondary: true
                    })
                ),
                React.createElement(
                    'div',
                    { style: styles.middle },
                    React.createElement(
                        'div',
                        { style: styles.selected },
                        selectedLabel()
                    ),
                    React.createElement(RaisedButton, {
                        label: '\u2192',
                        secondary: true,
                        onClick: this.onAssignItems,
                        style: styles.buttons,
                        disabled: this.state.loading || this.state.selectedLeft === 0
                    }),
                    React.createElement(RaisedButton, {
                        label: '\u2190',
                        secondary: true,
                        onClick: this.onRemoveItems,
                        style: styles.buttons,
                        disabled: this.state.loading || this.state.selectedRight === 0
                    }),
                    React.createElement(
                        'div',
                        { style: styles.status },
                        this.state.loading ? React.createElement(CircularProgress, { small: true, style: { width: 60, height: 60 } }) : undefined
                    )
                ),
                React.createElement(
                    'div',
                    { style: styles.right },
                    React.createElement(
                        Paper,
                        { style: styles.paper },
                        React.createElement(
                            'div',
                            { style: styles.hidden },
                            hiddenLabel(this.getAssignedItemsFilterCount())
                        ),
                        React.createElement(
                            'select',
                            {
                                multiple: true,
                                style: styles.select,
                                onChange: onChangeRight,
                                ref: function ref(r) {
                                    _this6.rightSelect = r;
                                }
                            },
                            this.getAssignedItemsFiltered().sort(this.byAssignedItemsOrder).map(function (item) {
                                return React.createElement(
                                    'option',
                                    {
                                        key: item.value,
                                        value: item.value,
                                        onDoubleClick: _this6.onRemoveItems,
                                        style: styles.options
                                    },
                                    item.text
                                );
                            })
                        )
                    ),
                    React.createElement(RaisedButton, {
                        label: '\u2190 ' + this.getTranslation('remove_all') + ' ' + (this.getAssignedItemsUnfilteredCount() > 0 ? this.getAssignedItemsUnfilteredCount() : ''),
                        style: { float: 'right', marginTop: '1rem' },
                        disabled: this.state.loading || this.getAssignedItemsUnfilteredCount() === 0,
                        onClick: this.onRemoveAll,
                        secondary: true
                    })
                )
            );
        }
    }]);

    return GroupEditor;
}(Component);

export default GroupEditor;


GroupEditor.propTypes = {
    // itemStore: d2-ui store containing all available items, either as a D2 ModelCollection,
    // or an array on the following format: [{value: 1, text: '1'}, {value: 2, text: '2'}, ...]
    itemStore: PropTypes.object.isRequired,

    // assignedItemStore: d2-ui store containing all items assigned to the current group, either
    // as a D2 ModelCollectionProperty or an array of ID's that match values in the itemStore
    assignedItemStore: PropTypes.object.isRequired,

    // filterText: A string that will be used to filter items in both columns
    filterText: PropTypes.string,

    // Note: Callbacks should return a promise that will resolve when the operation succeeds
    // and is rejected when it fails. The component will be in a loading state until the promise
    // resolves or is rejected.

    // assign items callback, called with an array of values to be assigned to the group
    onAssignItems: PropTypes.func.isRequired,

    // remove items callback, called with an array of values to be removed from the group
    onRemoveItems: PropTypes.func.isRequired,

    // remove items callback, called with an array of values to be removed from the group
    onMoveItems: PropTypes.func,

    // The height of the component, defaults to 500px
    height: PropTypes.number
};

GroupEditor.contextTypes = {
    d2: PropTypes.object
};

GroupEditor.defaultProps = {
    height: 500,
    filterText: '',
    onMoveItems: function onMoveItems() {}
};