import firebase from 'firebase/app';
import "firebase/firestore";

function parseDoc(doc){
    return {
        id: doc.id,
        ...doc.data()
    }
}

let db;
function getDbInstance(){
    if(!db || db._isTerminated){
        db = firebase.firestore();
    }
    return db;
}

async function addItemWithId(collection, item, id){
    const db = getDbInstance();
    const result = await db.collection(collection).doc(id).set(item);
    return !result;
}

async function updateItemMerge(collection, item, id){
    const db = getDbInstance();
    const result = await db.collection(collection).doc(id).set(item, {merge:true});
    return !result;
}

async function getItem(collection, itemId) {
    const db = getDbInstance();
    const document = await db.collection(collection).doc(itemId).get();
    if(document.exists){
        return parseDoc(document);
    }
    return null;
}

async function addItem(collection, item) {
    const db = getDbInstance();
    const result = await db.collection(collection).add(item)
    return !!result.id;
}

async function getAll(collection) {
    const db = getDbInstance();
    const collectionData = await db.collection(collection).get();

    const results = [];
    collectionData.forEach((document)=>{
        results.push(parseDoc(document));
    });

    return results;
}

async function getAllRealTime({ collection, filters, order, callback}){
    const db = getDbInstance();
    const dbCollection = db.collection(collection);
    const collectionFiltered = dbCollection.where(filters.field, filters.condition, filters.value);
    const collectionOrdered = collectionFiltered.orderBy(order, "desc");
    const execute = (collectionData) => {
        callback(collectionData)
    }
    collectionOrdered.onSnapshot(execute);
}

async function getItemRealTime({ collection, id, callback }){
    const db = getDbInstance();
    const dbItem = await db.collection(collection).doc(id);
    const execute = (dbitem) => {
        callback(dbitem);
    }
    dbItem.onSnapshot(execute);
}


async function deleteItem(collection, itemId) {
    const db = getDbInstance();
    const result = await db.collection(collection).doc(itemId).delete();
    return !result;
}

export{
    addItemWithId,
    getItem,
    addItem,
    updateItemMerge,
    getAllRealTime,
    getAll,
    deleteItem,
    getItemRealTime
}