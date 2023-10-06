import { prisma } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function PUT({request}) {
    const data = await request.json()
    console.log(data)
    const tricodes = await prisma.draftplanning.update(
        {where: 
            {draftid: data.draftId},
        data: {
            name: data.name,
            opponentid: data.opponent.id,
            bb1: data.DraftStack[0]['items'][0][0],   
            bb2: data.DraftStack[1]['items'][0][0],       
            bb3: data.DraftStack[2]['items'][0][0],       
            bb4: data.DraftStack[3]['items'][0][0],      
            bb5: data.DraftStack[4]['items'][0][0],      
            rb1: data.DraftStack[5]['items'][0][0],       
            rb2: data.DraftStack[6]['items'][0][0],       
            rb3: data.DraftStack[7]['items'][0][0],       
            rb4: data.DraftStack[8]['items'][0][0],       
            rb5: data.DraftStack[9]['items'][0][0],       
            bp1: data.DraftStack[10]['items'][0][0],       
            bp2: data.DraftStack[11]['items'][0][0],       
            bp3: data.DraftStack[12]['items'][0][0],       
            bp4: data.DraftStack[13]['items'][0][0],     
            bp5: data.DraftStack[14]['items'][0][0],       
            rp1: data.DraftStack[15]['items'][0][0],       
            rp2: data.DraftStack[16]['items'][0][0],       
            rp3: data.DraftStack[17]['items'][0][0],       
            rp4: data.DraftStack[18]['items'][0][0],       
            rp5: data.DraftStack[19]['items'][0][0]       
            }
        }
        )
    //console.log(teams)
    return json({ success: true });
}