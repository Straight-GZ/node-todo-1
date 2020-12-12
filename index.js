const db = require('./db')
const inquirer = require("inquirer");

module.exports.add = async (title) => {
    const list = await db.read()

    list.push({title, done: false})

    await db.write(list)
}
module.exports.clear=async ()=>{
    await db.write([])
}
function markAsDone(list, index) {
    list[index].done = true
    db.write(list).then(() => {
    }, () => {
    })
}

function markAsUnDone(list, index) {
    list[index].done = false
    db.write(list).then(() => {
    }, () => {
    })
}

function remove(list, index) {
    list.splice(index, 1)
    db.write(list).then(() => {
    }, () => {
    })
}

function updateTitle(list, index) {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '新的标题',
        default: list[index].title
    }).then(answer => {
        list[index].title = answer.title
        db.write(list).then(() => {
        }, () => {
        })
    })
}

function askForAction(list, index) {
    const actions = {
        markAsDone,
        markAsUnDone,
        remove,
        updateTitle
    }
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: '请选择操作',
        choices: [
            {name: '[q] 退出', value: 'quit'},
            {name: '已完成', value: 'markAsDone'},
            {name: '未完成', value: 'markAsUnDone'},
            {name: '重命名', value: 'updateTitle'},
            {name: '[x] 删除', value: 'remove'},
        ]
    }).then((answer2) => {
        const action = actions[answer2.action]
        action && action(list, index)
    })
}

function printTasks(list) {
    inquirer
        .prompt(
            {
                type: 'list',
                name: 'index',
                message: '请选择你需要操作的任务',
                choices: [{name: '[q] 退出', value: '-1'}, ...list.map((task, index) => {
                    return {name: `${task.done ? "[x]" : "[_]"} ${index + 1} - ${task.title}`, value: index.toString()}
                }), {name: '[+] 创建新的任务'+'\n', value: '-2'}],
            })
        .then((answer) => {
            const index = parseInt(answer.index)
            if (index >= 0) {
                askForAction(list, index)
            } else if (index === -2) {
                inquirer.prompt({
                    type: 'input',
                    name: 'title',
                    message: '新的任务名字',
                }).then(answer => {
                    list.push({
                        title: answer.title,
                        done: false
                    })
                    db.write(list).then(() => {
                    }, () => {
                    })
                })
            }
        });
}

module.exports.showAll = async () => {
    const list = await db.read()
    printTasks(list)
}