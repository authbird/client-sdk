import 'mocha';
import 'global-jsdom/register';
import {assert} from 'chai';
import npmPackage, {browser, init, session} from '../src/index';

describe('NPM Package', () => {

  it('should be an object', () => {
    assert.isObject(npmPackage);
  });

  describe('Functions', () => {

    describe('Init', () => {

      it('should have the function init', () => {
        assert.isFunction(npmPackage.init);
      });

    });

    describe('Session', () => {

      it('should have a session property', () => {
        assert.property(npmPackage, 'session');
      });

      it('should have the function create', () => {
        assert.isFunction(npmPackage.session.create);
      });

      it('should have the function getUserData', () => {
        assert.isFunction(npmPackage.session.getUserData);
      });

      it('should have the function delete', () => {
        assert.isFunction(npmPackage.session.delete);
      });

    });

    describe('Browser', () => {

      it('should have a browser property', () => {
        assert.property(npmPackage, 'browser');
      });

      it('should have the function loginUser', () => {
        assert.isFunction(npmPackage.browser.loginUser);
      });

    });

  });


});
