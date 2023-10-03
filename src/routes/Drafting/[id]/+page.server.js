import { prisma } from '$lib/server/db';

/** @type {import('./$types').PageServerLoad} */
export async function load({params}) {
    const draft = await prisma.draftplanning.findFirst({where: {draftid: params.id}})
    return {draft};
};