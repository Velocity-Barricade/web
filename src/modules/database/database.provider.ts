import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from '../../shared/index';
import { User } from '../users/user.entity';
import { FirebaseUser } from '../firebase-user/firebase-user.entity';

export const databaseProvider = {
    provide: 'SequelizeInstance',
    useFactory: async () => {
        let config;
        switch (process.env.NODE_ENV) {
            case 'prod':
            case 'production':
                config = databaseConfig.production;
            case 'dev':
            case 'development':
                config = databaseConfig.development;
            default:
                config = databaseConfig.development;
        }

        const sequelize = new Sequelize(config);
        sequelize.addModels([User, FirebaseUser]);
        await sequelize.sync();
        /* await sequelize.sync(); add this if you want to sync model and DB.*/
        return sequelize;
    }
};
