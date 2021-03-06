import Ember from 'ember';
import moment from 'moment';

const { inject: { service } } = Ember;

export default Ember.Controller.extend({
  currentUser: service('current-user'),

  responseMessage: "",
  errorMessage: "",
  maxmicrobudget: 0,
  maxvalue: 0,

  title: Ember.computed('proposal', function() {
      return this.get('proposal').get('title');
  }),
  description: Ember.computed('proposal', function() {
      return this.get('proposal').get('description');
  }),
  activities: Ember.computed('proposal', function() {
      return this.get('proposal').get('activities');
  }),
  contact: Ember.computed('proposal', function() {
      return this.get('proposal').get('contact');
  }),
  recipient: Ember.computed('proposal', function() {
      return this.get('proposal').get('recipient');
  }),
  recipient2: Ember.computed('proposal', function() {
      return this.get('proposal').get('recipient2');
  }),
  value: Ember.computed('proposal', function() {
      return this.get('proposal').get('value');
  }),
  realvalue: Ember.computed('proposal', function() {
      return this.get('proposal').get('realvalue');
  }),
  startdate: Ember.computed('proposal', function() {
      return this.get('proposal').get('starts');
  }),
  finisheddate: Ember.computed('proposal', function() {
      return this.get('proposal').get('finished_date');
  }),

  isMicroBudget: Ember.computed('value', function() {
      const max = this.get('maxmicrobudget');
      return max === 0 || this.value === '' || parseInt(this.value) <= max;
  }),

  maxBudget: Ember.computed('startdate', 'maxmicrobudget', 'maxvalue', function() {
      this.store.query('budget', {
          month: moment(this.get('startdate')).add(14, 'd').toDate().getMonth() + 1
      }).then((budget) => {
          this.set('maxmicrobudget', budget.objectAt(0).get('value'));
          this.set('maxvalue', budget.objectAt(0).get('maxvalue'));
      });

      return this.get('maxmicrobudget');
  }),

  minimumProposalStartDate: Ember.computed(function() {
      var date = moment().add(1, 'd').toDate();
      return moment(date).format('YYYY/MM/DD');
  }),

  isValid: Ember.computed('recipient', 'recipient2', 'contact', 'title', 'description', 'activities', 'value', 'startdate', 'finisheddate', function() {
      const title = this.get('title');
      const description = this.get('description');
      const activities = this.get('activities');
      const contact = this.get('contact');
      const recipient = this.get('recipient');
      const recipient2 = this.get('recipient2');
      const value = this.get('value');
      const startdate = this.get('startdate');
      const finisheddate = this.get('finisheddate');

      return title.length > 0 && description.length > 0 &&
             activities.length > 0 && contact.length > 0 &&
             recipient.length > 0 && (value <= this.maxmicrobudget || recipient2.length > 0) &&
             parseInt(value) > 0 && parseInt(value) <= this.maxvalue &&
             startdate.getFullYear() > 0 && finisheddate.getFullYear() > 0;
  }),
  isDisabled: Ember.computed.not('isValid'),

  actions: {
    saveProposal() {
      this.set('errorMessage', '');
      this.set('responseMessage', '');
      this.set('progressMessage', `Saving proposal...`);

      const title = this.get('title');
      const description = this.get('description');
      const activities = this.get('activities');
      const contact = this.get('contact');
      const recipient = this.get('recipient');
      const recipient2 = this.get('recipient2');
      const value = this.get('value');
      const realvalue = this.get('realvalue');
      const startdate = this.get('startdate');
      const finisheddate = this.get('finisheddate');

      var proposal = this.get('proposal');

      proposal.set('title', title);
      proposal.set('description', description);
      proposal.set('activities', activities);
      proposal.set('contact', contact);
      proposal.set('recipient', recipient);
      proposal.set('recipient2', recipient2);
      proposal.set('value', value);
      proposal.set('realvalue', realvalue);
      proposal.set('starts', startdate);
      proposal.set('finished_date', finisheddate);

      proposal.save().then(
        (/*proposal*/) => {
          this.set('responseMessage', `Your proposal has been updated. Thank you!`);
          this.set('progressMessage', '');
/*          this.set('title', '');
          this.set('description', '');
          this.set('recipient', '');
          this.set('value', '');
          this.set('startdate', new Date());*/
        },
        error => {
          this.set('errorMessage', `Failed updating your proposal: ` + error);
          this.set('progressMessage', '');
        }
      );
    }
  }
});
