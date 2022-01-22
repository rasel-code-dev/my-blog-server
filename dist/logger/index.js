const winston = require("winston");
let now = new Date();
const logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }), winston.format.colorize(), winston.format.align(), winston.format.printf(info => {
        return `${info.level}: ${[info.timestamp]}: ${info.message} : \n ${info.meta}`;
    })),
    transports: [
        new winston.transports.Console({
            level: 'info',
        }),
        new winston.transports.Console({
            level: 'warn',
        }),
        // only for production for
        // new winston.transports.File({
        //   level: 'error',
        //   filename: `logs/error-${now.toDateString()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}-${now.getMilliseconds()}.log`,
        // }),
        // new winston.transports.File({
        //   level: 'warn',
        //   filename: `logs/warn-${now.toDateString()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}-${now.getMilliseconds()}.log`,
        // })
    ]
});
module.exports = logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJsb2dnZXIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRW5DLElBQUksR0FBRyxHQUFJLElBQUksSUFBSSxFQUFFLENBQUM7QUFDdEIsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztJQUVsQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUMsTUFBTSxFQUFFLHNCQUFzQixFQUFDLENBQUMsRUFDMUQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFDekIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFDdEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDM0IsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxDQUFDLE9BQU8sU0FBUyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDaEYsQ0FBQyxDQUFDLENBQ0g7SUFFRCxVQUFVLEVBQUU7UUFDVixJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO1lBQzdCLEtBQUssRUFBRSxNQUFNO1NBQ2QsQ0FBQztRQUNGLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7WUFDN0IsS0FBSyxFQUFFLE1BQU07U0FDZCxDQUFDO1FBRUYsMEJBQTBCO1FBRTFCLGdDQUFnQztRQUNoQyxvQkFBb0I7UUFDcEIseUlBQXlJO1FBQ3pJLE1BQU07UUFDTixnQ0FBZ0M7UUFDaEMsbUJBQW1CO1FBQ25CLHdJQUF3STtRQUN4SSxLQUFLO0tBQ047Q0FDRixDQUFDLENBQUE7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQSJ9