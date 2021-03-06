import $ from 'jquery';
import Backbone from 'backbone';
import { SortView } from './view-sort';
import { EventsView } from './view-events';
import { AlternateView } from './view-alternate';
import AllEvents from './transformAllEvents';
import { Login } from './view-login';

Backbone.View.prototype.close = function(){
  this.remove();
  this.unbind();
  if (this.onClose){
    this.onClose();
  }
};

var ViewManager = {
  currentView : null,
  showView : function(view, ...extras) {
    if (this.currentView !== null) {
      this.currentView.close();
    }
    this.currentView = new view({
      routeParameters: extras
    });

    return this.currentView.el;
  }
};

const ApplicationRouter = Backbone.Router.extend({
  routes: {
    "events": "events",
    "login": "login",
    "sort": "sort",
    "alternate": "alternate",
    "allEvents": "allEvents",
    "*default": "events"
  },

  login() {

    $('#root').html(ViewManager.showView(Login));
    $('ul.nav-pills > li').removeClass('active');
    $('ul.nav-pills > li.nav-item.login').addClass('active');
  },

  // only for development purposes, not given a direct link
  allEvents() {
    $('#root').html(ViewManager.showView(AllEvents));
    $('ul.nav-pills > li').removeClass('active');
    this.navigate("#/allEvents", {trigger: false, replace: true});
  },

  sort() {
    $('#root').html(ViewManager.showView(SortView));
    $('ul.nav-pills > li').removeClass('active');
    $('ul.nav-pills > li.nav-item.sort').addClass('active');
    this.navigate("#/sort", {trigger: false, replace: true});
  },

  events() {
    $('#root').html(ViewManager.showView(EventsView));
    $('ul.nav-pills > li').removeClass('active');
    $('ul.nav-pills > li.nav-item.events').addClass('active');
    this.navigate("#/events", {trigger: false, replace: true});
  },

  alternate() {
    $('#root').html(ViewManager.showView(AlternateView));
    $('ul.nav-pills > li').removeClass('active');
    $('ul.nav-pills > li.nav-item.alternate').addClass('active');
    this.navigate("#/alternate", {trigger: false, replace: true});
  }

});

export default ApplicationRouter;
