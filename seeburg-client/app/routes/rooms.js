import Ember from 'ember';

var testRooms = [{
    title: "Room toony"
  }, {
    title: "Room boomy"
}];

export default Ember.Route.extend({
  model() {
    return testRooms;
  }
});
