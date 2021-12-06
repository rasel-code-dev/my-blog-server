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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvbG9nZ2VyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUVuQyxJQUFJLEdBQUcsR0FBSSxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ3RCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7SUFFbEMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFDLE1BQU0sRUFBRSxzQkFBc0IsRUFBQyxDQUFDLEVBQzFELE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQ3pCLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQ3RCLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzNCLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUksQ0FBQyxPQUFPLFNBQVMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ2hGLENBQUMsQ0FBQyxDQUNIO0lBRUQsVUFBVSxFQUFFO1FBQ1YsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztZQUM3QixLQUFLLEVBQUUsTUFBTTtTQUNkLENBQUM7UUFDRixJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO1lBQzdCLEtBQUssRUFBRSxNQUFNO1NBQ2QsQ0FBQztRQUVGLDBCQUEwQjtRQUUxQixnQ0FBZ0M7UUFDaEMsb0JBQW9CO1FBQ3BCLHlJQUF5STtRQUN6SSxNQUFNO1FBQ04sZ0NBQWdDO1FBQ2hDLG1CQUFtQjtRQUNuQix3SUFBd0k7UUFDeEksS0FBSztLQUNOO0NBQ0YsQ0FBQyxDQUFBO0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUEifQ==