## Run project:

##### Production build:

```
docker-compose up
```

##### Development build:

```
npm run dev:build
npm run dev:start
```

##### Generate migration:

```
npx typeorm migration:generate -n init_migration -d src/migrations --config build/OrmConfig.js
```

##### Run migrations:

```
npx typeorm migration:run --config build/OrmConfig.js
```

##### Revert last migration:

```
npx typeorm migration:revert --config build/OrmConfig.js
```
