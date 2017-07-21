import Backbone from 'backbone';
import $ from 'jquery';
import database from './collection-database';
import './css-edit.css';

export const EditView = Backbone.View.extend({
  initialize(options) {
    this.collection = database;
    this.options = options;
    this.editBlock = new EditBlock({
      model: this.collection.get(options.cid)
    });
    this.render();
  },
  render() {
    this.$el.html(this.editBlock.el);
  }
});

const EditBlock = Backbone.View.extend({
  initialize() {
    this.render();
    this.listenTo(this.model, 'change', this.renderClose);
  },
  events: {
    'submit': 'handleSubmit',
  },
  renderClose() {
    console.log('renderClose');
    this.$el.find('.closeModal').removeClass('hidden');
  },
  handleSubmit(e) {
    e.preventDefault();
    this.composeEventUpdate();
  },
  composeEventUpdate() {
    let timingResult = [];
    $('.timingPill').each((x, y) => timingResult.push($(y).text()));

    let formResult = {};
    this.$el.find('.editBlock').serializeArray().forEach(x => {
      formResult[x.name] = x.value;
    });
    formResult.timing = timingResult;
    console.log('formResult', formResult);
    this.model.set(formResult);
  },
  render() {
    this.$el.html('');
    this.$el.append(`
    <form class="editBlock">

    <label>event text:<br>
      <textarea class="event-text" name="text" rows="3" cols="70" type="text-box">${this.model.get('text')}</textarea>
    </label><br>

    <label>Dates (click to delete):<br>
      <div class="timingBlocks"></div><br>
    </label><br>

    <label>repeat pattern: (delete event and re-create to change)<br>
      <select disabled class="form-control" name="repeat">
        <option ${this.model.get('repeat') === 'annual' ? 'selected' : ''} value="annual">annual</option>
        <option ${this.model.get('repeat') === 'variable' ? 'selected' : ''} value="variable">variable</option>
        <option ${this.model.get('repeat') === 'banner' ? 'selected' : ''} value="banner">calendar month heading</option>
      </select>
    </label><br>

    <label>shading:<br>
      <select class="form-control" name="shading">
        <option ${this.model.get('shading') === 'none' ? 'selected' : ''} value="none">none</option>
        <option ${this.model.get('shading') === 'full' ? 'selected' : ''} value="full">full</option>
        <option ${this.model.get('shading') === 'bars' ? 'selected' : ''} value="bars">horizontal bars</option>
        <option ${this.model.get('shading') === 'diagonal' ? 'selected' : ''} value="diagonal">diagonal</option>
      </select>
    </label><br>

    <label>mlh:<br>
      <select class="form-control" name="mlh">
        <option ${this.model.get('mlh') === 'no' ? 'selected' : ''} value="no">no</option>
        <option ${this.model.get('mlh') === 'yes' ? 'selected' : ''} value="yes">yes</option>
      </select>
    </label><br>

    <label>asp:<br>
    <select class="form-control" name="asp">
    <option ${this.model.get('asp') === 'no' ? 'selected' : ''} value="no">no</option>
    <option ${this.model.get('asp') === 'yes' ? 'selected' : ''} value="yes">yes</option>
    </select>
    </label><br>

    <label>annual presidential proclamation:<br>
    <select class="form-control" name="proclamation">
    <option ${this.model.get('proclamation') === 'no' ? 'selected' : ''} value="no">no</option>
    <option ${this.model.get('proclamation') === 'yes' ? 'selected' : ''} value="yes">yes</option>
    </select>
    </label><br>

    <label>event starts previous sundown:<br>
      <select class="form-control" name="previousSundown">
        <option ${this.model.get('previousSundown') === 'no' ? 'selected' : ''} value="no">no</option>
        <option ${this.model.get('previousSundown') === 'yes' ? 'selected' : ''} value="yes">yes</option>
      </select>
    </label><br>
    <br>
    <button type='submit' class="btn btn-primary btn-lg">Update</button>

    <button data-dismiss="modal" type='button' class="hidden btn btn-success btn-lg closeModal">Update Successful. Click to close</button>

    </form>
    `);
    this.$el.find('.timingBlocks').html(new TimingBlockContainer({
      model: this.model
    }).el);
    return this;
  }
});

const TimingBlockContainer = Backbone.View.extend({
  initialize() {
    this.render();
  },
  tagName: 'span',
  render() {
    this.model.get('timing').forEach(x => {
      this.$el.append(new TimingPill({
        timingString: x
      }).el);
    });
    return this;
  }
});

const TimingPill = Backbone.View.extend({
  initialize(options) {
    this.options = options;
    this.render();
  },
  events: {
    'click': 'handleClick'
  },
  handleClick(e) {
    console.log('timing pill handle click', e);
    let remove = this.$el.index();
    $('.timingPill').eq(remove).remove();
  },
  tagName: 'button',
  className: 'btn btn-sm btn-danger timingPill',
  render() {
    this.$el.html(`${this.options.timingString}<i class="glyphicon glyphicon-remove"></i>`);
    return this;
  }
});
