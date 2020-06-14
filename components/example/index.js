export default {
    name: "Example",
    sysname: "example",

    admin: () => import("./Admin"),
    defaultSettings: () => ({}),

    examinee: () => import("./Examinee"),
    reviewer: () => import("./Reviewer"),
    defaultAnswer: () => ({})
}