import React from "react"
import { connect } from "react-redux"
import Modal from "../../Modals/Modal"
import { openModal, closeModal } from "../../../redux/actions/modal"

class SafetyModal extends React.Component {
  state = {}
  render() {
    return (
      <Modal isOpen={this.props.modalIsOpen}>
        {() => (
          <div className="startTrip-flow">
            <div className="flow-header">
              <h4>Activate Safety Feature</h4>
              <div>
                Your emergency contact will receive a SMS alert containing your
                last known location
              </div>
              <br />
              <div>
                The alert will not be sent if you mark your trip as completed by
                the specified time limit
              </div>
            </div>
            <Form onSubmit={this.startingTrip({ trip })}>
              <label>Time Limit</label>
              <GhostInput
                placeholder="How many hours should we wait?"
                value={this.state.hours}
                name="hours"
                onChange={this.handleHoursInput}
              />
              <div className="dual-buttons">
                <Button className="btn-primary">Activate</Button>
                <Button
                  className="btn-secondary"
                  onClick={() => this.setState({ disableSafety: true })}
                >
                  No Thanks
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SafetyModal)
