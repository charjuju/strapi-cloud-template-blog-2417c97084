module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/task/nopro',
            handler: 'nopro.indexNonPro',
        },
        {
            method: 'GET',
            path: '/task/myTask',
            handler: 'nopro.myTasks',
        }
    ]
}