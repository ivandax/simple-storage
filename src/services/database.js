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

async function updateItemMerge(collection, item, id){
    const db = getDbInstance();
    const result = await db.collection(collection).doc(id).set(item, {merge:true});
    return !result;
}


async function getByName(collection, name) {
    const db = getDbInstance();
    const dbCollection = db.collection(collection);
    const collectionFiltered = dbCollection.where('name', '==', name);
    const collectionData = await collectionFiltered.get();

    const results = [];
    collectionData.forEach((document)=>{
        results.push(parseDoc(document));
    });

    return results;
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

export{
    addItem,
    updateItemMerge,
    getAll,
    getByName
}