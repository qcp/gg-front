export default {
    name: "Online publishing",
    sysname: "online_publishing",

    admin: () => import("./Admin"),
    defaultSettings: () => ({}),

    examinee: () => import("./Examinee"),
    reviewer: () => import("./Reviewer"),
    defaultAnswer: () => ({ links: [] })
}