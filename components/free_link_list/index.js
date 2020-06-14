export default {
    name: "Free link list",
    sysname: "free_link_list",

    admin: () => import("./Admin"),
    defaultSettings: () => ({
        title: "",
        subtitle: "",
        regex: ""
    }),

    examinee: () => import("./Examinee"),
    reviewer: () => import("./Reviewer"),
    defaultAnswer: () => ({
        links: []
    })
}