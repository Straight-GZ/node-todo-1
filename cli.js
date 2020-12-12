#!/usr/bin/env node
const {program} = require('commander');
const api = require("./index.js")
const pkg = require("./package.json")

program
    .version(pkg.version)
program
    .command("add")
    .description("add a task")
    .action((...args) => {
        const words = args.slice(1)[0].join(" ")
        api.add(words).then(
            () => {
                console.log("添加成功")
            },
            () => {
                console.log("添加失败")
            }
        )
    })
program
    .command("clear")
    .description("clear all tasks")
    .action(() => {
        api.clear().then(
            () => {
                console.log("清除完毕")
            },
            () => {
                console.log("清除失败")
            }
        )
    })
program
    .command("t")
    .description("show all")
    .action(() => {
        api.showAll().then(
            () => {console.log('成功')
            },
            () => {
                console.log("\n")
            })
    })


program.parse(process.argv)
