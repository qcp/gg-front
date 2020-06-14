export default {
    name: "Fixed link list",
    sysname: "fixed_link_list",

    admin: () => import("./Admin"),
    defaultSettings: () => ({
        title: "",
        subtitle: "",
        attaches: []
    }),

    examinee: () => import("./Examinee"),
    reviewer: () => import("./Reviewer"),
    defaultAnswer: (settings) => ({
        links: settings.attaches.map(() => ({ url: ""}))
    })
}