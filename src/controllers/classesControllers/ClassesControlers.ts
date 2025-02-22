import {Request, Response} from 'express';

import db from  '../../database/connection';

import Converter from '../../functionsUltilits/converterHourInMinutes';


interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;


}

export default class ClassesController{

    async index(request: Request, response: Response){
        const filters = request.query;

        const week_day = filters.week_day;
        const subject = filters.subject as string;
        const time = filters.time as string;

      if (!filters.week_day || !filters.subject || !filters.time ) {
            return(
                response.status(400).json({
                    error: 'Missing filters to search classes'
                })
            )
        }

        const timeInMinutes = Converter(filters.time as string);

        const classes = await db('classes')
            .whereExists( function(this: any) {
                this.select('classes_schedule.*')
                .from('classes_schedule')
                .whereRaw('`classes_schedule`.`class_id` = `classes`.`id`')
                .whereRaw('`classes_schedule`.`week_day` = ??', [Number(week_day)])
                .whereRaw('`classes_schedule`. `from` <= ??', [timeInMinutes] )
                .whereRaw('`classes_schedule`. `to` > ??', [timeInMinutes] )
        })
        .where('classes.subject', '=', subject)
        .join('users', 'classes.user_id', '=', 'users.id')
        .select(['classes.*', 'users.*']);

        

        return(
            response.send(classes) 
        )


    }

    async create(request: Request, response: Response){
    
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;
    
        const trx = await db.transaction();
    
       
        try {
            const insertUserIds =  await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio,
            });
        
            const user_id = insertUserIds[0];
        
            
            const insertedClassesIds =  await trx('classes').insert({
            subject,
            cost,
            user_id
            });    
        
        
            const class_id = insertedClassesIds[0];
        
        
            const classSchedule = schedule.map((scheduleItem: ScheduleItem)  => {
        
            return{
                class_id,
                week_day: scheduleItem.week_day,
                from: Converter(scheduleItem.from),
                to: Converter(scheduleItem.to)
                
            };  
        
            
            });
        
            await trx('classes_schedule').insert(classSchedule);
        
            
            return(
                response.status(201).send()
            )
        } catch (error) {
            await trx.rollback();
            console.log(error)
            return response.status(400).json({
                erro: 'Unexpected erro while creating new class'
            })
        }
    
        }
}