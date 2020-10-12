# Space-X

The space-x team is designing their next launch to the international space station, and this project will be used to organize tasks using Trello.


Currently, only three types of tasks can be created in Trello:
1. **An issue**: This represents a business feature that needs implementation, they will provide a short title and a description. All issues gets added to the “To Do” list as unassigned.
2. **A bug**: This represents a problem that needs fixing. They will only provide a description, the title needs to be randomized with the following pattern: bug-{word}-{number}. It doesn't matter that they repeat internally. The bugs should be assigned to a random member of the board and have the “Bug” label.
3. **A task**: This represents some manual work that needs to be done. It will count with just a title and a category (Maintenance, Research, or Test) each corresponding to a label in trello. 

## Execution
To start using the project you must run:

```sh
npm install
```

```sh
npm start
```

This project will be by default at **http://localhost:8080**

## Use
The Trello board currently in use is https://trello.com/b/tqulOYEn/space-x

### To create your first task:

First you must make a POST to the path **/api/card** and you must send a body similar to:
```sh
{
    "type": "issue",
    "title":"Send message",
    "description": "Let pilots send messages to Central"
}
```

The **type** variable must change if the task is an issue, bug or task.

