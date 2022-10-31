/**
 * Created by Tri on 8/18/2017.
 */
import config from '../config/config';

const getAllReminders = (token) => (
    fetch(config.host_domain + '/api/memory/getAllReminders',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'JWT ' + token
            },

        })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
);

const getAllRemindersType1 = (token) => (
    fetch(config.host_domain + '/api/memory/getAllRemindersType1',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'JWT ' + token
            },

        })
        .then(response => response.json())
        .catch(err => console.log(err))
);

const getLast5Memories = (token) => (
    fetch(config.host_domain + '/api/memory/getLast5Memories',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'JWT ' + token
            },
        })
        .then(response => response.json())
        .catch(err => console.log(err))
);

const addReminder = (token, reminder) => (
    fetch(config.host_domain + '/api/memory/addReminder',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: 'JWT ' + token
            },
            body: JSON.stringify(reminder)
        })
        .then(response => response.json())
        .catch(err => console.log(err))
);

const setReminderType1 = (token, reminder) => (
    fetch(config.host_domain + '/api/memory/setReminderType1',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: 'JWT ' + token
            },
            body: JSON.stringify(reminder)
        })
        .then(response => response.json())
        .catch(err => console.log(err))
);

const addMemory = (token, memory) => (
    fetch(config.host_domain + '/api/memory/addMemory',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: 'JWT ' + token
            },
            body: JSON.stringify(memory)
        })
        .then(response => response.json())
        .catch(err => console.log(err))
);

const editReminderType1 = (token, reminder) => (
    fetch(config.host_domain + '/api/memory/editReminderType1',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: 'JWT ' + token
            },
            body: JSON.stringify(reminder)
        })
        .then(response => response.json())
        .catch(err => console.log(err))
);

const cancelReminderType1 = (token, reminderId) => (
    fetch(config.host_domain + '/api/memory/cancelReminderType1/' + reminderId,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: 'JWT ' + token
            },
        })
        .then(response => response.json())
        .catch(err => console.log(err))
);

const loveMemory = (token, memoryId) => (
    fetch(config.host_domain + '/api/memory/love/' + memoryId,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: 'JWT ' + token
            },
        })
        .then(response => response.json())
        .catch(err => console.log(err))
);

const getAllTimeUnit = (token) => (
    fetch(config.host_domain + '/api/memory/getAllTimeUnit',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: 'JWT ' + token
            },
        })
        .then(response => response.json())
        .catch(err => console.log(err))
);

const addNewAnniversaryMileStone = (token, number, timeUnit) => (
    fetch(config.host_domain + '/api/memory/addNewAnniversaryMileStone',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: 'JWT ' + token
            },
            body: JSON.stringify({
                number: number,
                timeUnit: timeUnit
            })
        })
        .then(response => response.json())
        .catch(err => console.log(err))
);

module.exports = {
    getAllReminders,
    getAllRemindersType1,
    getLast5Memories,
    addReminder,
    setReminderType1,
    addMemory,
    editReminderType1,
    cancelReminderType1,
    loveMemory,
    getAllTimeUnit,
    addNewAnniversaryMileStone
};