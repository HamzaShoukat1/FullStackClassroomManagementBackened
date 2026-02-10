import { asynchandler } from "../utils/AsyncHandler";
//gel all subjects with optional search,filtering ,pagination
import { db } from "../db";
import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import { departments, subjects } from "../db/Schema";
import { Apiresponse } from "../utils/ApiResponse";

const getAllSubjects = asynchandler(async (req, res) => {
    const { search, department, page = 1, limit = 10 } = req.query
    const currentPage = Math.max(1, +page)
    const limitPerPage = Math.max(1, +limit)

    const offset = (currentPage - 1) * limitPerPage

    const filterConditions = []
    if (search) {
        filterConditions.push(
            or(
                ilike(subjects.name, `%${search}%`),
                ilike(subjects.code, `%${search}%`)

            )
        )

    };

    if (department) {
        filterConditions.push(
            or(
                ilike(departments.name, `%${department}%`)
            )
        )
    };
    const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined
    const countResult = await db.select({ count: sql<number>`count(*)` })
        .from(subjects)
        .leftJoin(departments, eq(subjects.departmentId, departments.id))
        .where(whereClause)

    const totalCount = countResult[0]?.count ?? 0;





    // data query 
    const subjectLists = await db.select({
        ...getTableColumns(subjects),
        department: {
            ...getTableColumns(departments)
        },
    })
        .from(subjects)
        .leftJoin(departments, eq(subjects.departmentId, departments.id))
        .where(whereClause)
        .orderBy(desc(subjects.createdAt))
        .limit(limitPerPage)
        .offset(offset)


    return res.status(200).json(
        new Apiresponse(
            200,
            {
                subjectLists,

                pagination: {
                    page: currentPage,
                    limit: limitPerPage,
                    total: Number(totalCount),
                    totalPages: Math.ceil(totalCount / limitPerPage),
                },
            },
            "subject lists fetched successfully"
        )
    );

})

export {
    getAllSubjects
}