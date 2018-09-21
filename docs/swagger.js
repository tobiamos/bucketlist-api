const swagger = require('./swagger.json');
const login = require('./auth/login.json');
const register = require('./auth/register.json');
const createBucketList = require('./bucketlist/createList.json');
const getLists = require('./bucketlist/getLists.json');
const getOneList = require('./bucketlist/getOneList.json');
const updateList = require('./bucketlist/updateOneList.json');
const deleteList = require('./bucketlist/deleteOneList.json');
const createItem = require('./items/createItem.json');
const getAllItems = require('./items/getAllItems.json');
const getOneItem = require('./items/getOneItem.json');
const updateOneItem = require('./items/updateOneItem.json');
const deleteOneItem = require('./items/deleteOneItem.json');

swagger.paths['/auth/register'] = register;
swagger.paths['/auth/login'] = login;
swagger.paths['/bucketlists'] = createBucketList;
swagger.paths['/bucketlists/'] = getLists;
swagger.paths['/bucketlists/{bucketId}/'] = getOneList;
swagger.paths['/bucketLists/{bucketId}'] = updateList;
swagger.paths['/bucketLists/<bucketId>'] = deleteList;
swagger.paths['/bucketLists/<bucketId>/items'] = createItem;
swagger.paths['/bucketLists/{bucketId}/items'] = getAllItems;
swagger.paths['/bucketLists/<bucketId>/items/{itemId}/'] = getOneItem;
swagger.paths['/bucketLists/<bucketId>/items/{itemId}'] = updateOneItem;
swagger.paths['/bucketLists/{bucketId}/items/{itemId}/'] = deleteOneItem;


module.exports = swagger;
