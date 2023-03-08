###Notes:

1. Install typeorm cli to run migrations using this link https://github.com/typeorm/typeorm/blob/master/docs/using-cli.md#installing-cli

#### To run migration:

1. Create migration files locally using creds from `sample.env` and running following command `yarn typeorm migration:generate -n NameOfMigration`
2. After creating migration check the migration files in `migration` folder and run the following command if everything is ok `yarn typeorm migration:run`;
