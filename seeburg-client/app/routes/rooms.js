import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.find('room');
  },
  actions: {
    createRoom: function(newRoom){
      //var room = this.
    }
  }
});
