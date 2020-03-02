
import firebase from 'firebase';
import {
 addItem 
} from './database';
import 'firebase/firestore';
import config from '../config';

firebase.initializeApp(config.firebase);

describe('API - CRUD', () => {
    it('add item test', async () => {
      const collection = 'testing';
      const item = {
            name: "trial",
            pic: "trial"
      };
      const result = await addItem(collection, item);
      expect(!!result).toBe(true);
    });
});