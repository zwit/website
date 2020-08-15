/* eslint-disable react/jsx-props-no-spreading */
import Translator from 'bazinga-translator';
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MpdCheckbox, MpdPopover, MpdIcon } from '@mapado/makeup';
import DeleteIcon from '@material-ui/icons/Delete';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import './MarketingSettings.css';

function getStyle(isDragging, dndStyle) {
  const style = {
    ...dndStyle,
  };

  if (isDragging) {
    style.display = 'table';
  }

  return style;
}

export default function OrderedList({
  handleDragEnd,
  customerFieldCurrentList,
  deleteCustomerField,
  toggleCheckField,
  requiredFieldMap,
  displayType,
}) {
  function handleItemDragEnd(result) {
    if (!result.destination) {
      return;
    }

    let customFieldCurrentList = requiredFieldMap.sort((a, b) =>
      a.get('position') > b.get('position') ? 1 : -1
    );

    const destinationPaymentMethodPosition = customFieldCurrentList.getIn([
      result.destination.index,
      'position',
    ]);
    const firstIndex =
      result.destination.index < result.source.index
        ? result.destination.index
        : result.source.index;
    const lastIndex =
      result.destination.index > result.source.index
        ? result.destination.index
        : result.source.index;

    if (firstIndex === result.source.index) {
      for (let index = lastIndex; index >= firstIndex; index--) {
        if (index === firstIndex) {
          customFieldCurrentList = customFieldCurrentList.setIn(
            [index, 'position'],
            destinationPaymentMethodPosition
          );
        } else {
          customFieldCurrentList = customFieldCurrentList.setIn(
            [index, 'position'],
            customFieldCurrentList.getIn([index - 1, 'position'])
          );
        }
      }
    } else {
      for (let index = firstIndex; index <= lastIndex; index++) {
        if (index === lastIndex) {
          customFieldCurrentList = customFieldCurrentList.setIn(
            [index, 'position'],
            destinationPaymentMethodPosition
          );
        } else {
          customFieldCurrentList = customFieldCurrentList.setIn(
            [index, 'position'],
            customFieldCurrentList.getIn([index + 1, 'position'])
          );
        }
      }
    }

    handleDragEnd(customFieldCurrentList);
  }

  return (
    <DragDropContext onDragEnd={handleItemDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <table className="mpd-table mpd-table--with-border">
              <thead>
                <tr>
                  <th> </th>
                  <th>
                    {Translator.trans(
                      'ticketing.settings.customizedFields.label'
                    )}
                  </th>
                  <th>
                    {Translator.trans(
                      'ticketing.settings.customizedFields.required'
                    )}
                  </th>
                  <th>
                    {Translator.trans(
                      'ticketing.settings.customizedFields.actions'
                    )}
                  </th>
                </tr>
              </thead>

              <tbody>
                {customerFieldCurrentList &&
                  customerFieldCurrentList.map((customerField, index) => (
                    <Draggable
                      key={`${customerField.getShortId()}`}
                      draggableId={`${customerField.getShortId()}`}
                      index={index}
                    >
                      {(providedInner, snapshotInner) => (
                        <tr
                          key={`${customerField.getShortId()}`}
                          ref={providedInner.innerRef}
                          {...providedInner.draggableProps}
                          style={getStyle(
                            snapshotInner.isDragging,
                            providedInner.draggableProps.style
                          )}
                        >
                          <td className="vmiddle">
                            <article className="mpd-table__cell-description">
                              <div {...providedInner.dragHandleProps}>
                                <MpdIcon
                                  icon="9-dots"
                                  className="ticketing-session__price-sort-icon"
                                  width="16"
                                />
                                {provided.placeholder}
                              </div>
                            </article>
                          </td>
                          {displayType && (
                            <td>
                              <aside className="mpd-table__header-small">
                                {Translator.trans(
                                  'ticketing.settings.customizedFields.inputType'
                                )}
                              </aside>
                              {Translator.trans(
                                `ticketing.settings.customizedFields.${customerField.get(
                                  'inputType'
                                )}`
                              )}
                            </td>
                          )}
                          <td>
                            <aside className="mpd-table__header-small">
                              {Translator.trans(
                                'ticketing.settings.customizedFields.label'
                              )}
                            </aside>
                            {Translator.trans(customerField.get('label'))}
                          </td>
                          <td>
                            <aside className="mpd-table__header-small">
                              {Translator.trans(
                                'ticketing.settings.customizedFields.required'
                              )}
                            </aside>
                            <MpdCheckbox
                              inputProps={{
                                id: index,
                                defaultChecked: requiredFieldMap
                                  .find(
                                    (selected) =>
                                      selected.get('slug') ===
                                      customerField.get('slug')
                                  )
                                  .get('required'),
                                onChange: (e) =>
                                  toggleCheckField(e, customerField),
                              }}
                            />
                          </td>
                          <td>
                            <aside className="mpd-table__header-small">
                              {Translator.trans(
                                'ticketing.settings.customizedFields.actions'
                              )}
                            </aside>
                            <Actions className="mpd-table__actions">
                              <MpdPopover>
                                <button
                                  className="block mpd-table__action"
                                  type="button"
                                  onClick={() =>
                                    deleteCustomerField(
                                      customerField.get('slug')
                                    )
                                  }
                                >
                                  {Translator.trans(
                                    'ticketing.settings.customizedFields.delete'
                                  )}
                                </button>
                              </MpdPopover>
                            </Actions>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

const Actions = styled.div`
  margin-top: -10px;
`;

OrderedList.defaultProps = {

};

OrderedList.propTypes = {
  handleDragEnd: PropTypes.func.isRequired,
  customerFieldCurrentList: ImmutablePropTypes.map.isRequired,
  deleteCustomerField: PropTypes.func.isRequired,
  toggleCheckField: PropTypes.func.isRequired,
  requiredFieldMap: ImmutablePropTypes.map.isRequired,
};
