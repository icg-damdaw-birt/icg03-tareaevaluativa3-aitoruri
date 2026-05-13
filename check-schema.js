const prisma = require('./lib/prisma');

async function fixNulls() {
  try {
    // Contar películas con isFavorite NULL
    const result = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Movie" WHERE "isFavorite" IS NULL`;
    const countBefore = result[0]?.count || 0;
    
    console.log(`📊 Películas con isFavorite = NULL: ${countBefore}`);
    
    if (countBefore > 0) {
      // Actualizar NULL a false (0 en SQLite)
      const updateResult = await prisma.$executeRaw`
        UPDATE "Movie" SET "isFavorite" = 0 WHERE "isFavorite" IS NULL
      `;
      
      console.log(`✅ Actualizadas películas`);
      
      // Verificar
      const resultAfter = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Movie" WHERE "isFavorite" IS NULL`;
      const countAfter = resultAfter[0]?.count || 0;
      
      console.log(`📊 Películas con isFavorite = NULL después: ${countAfter}`);
      
      // Total de películas
      const total = await prisma.movie.count();
      console.log(`✅ Total de películas: ${total}`);
    } else {
      console.log('✅ No hay películas con NULL, todo está bien');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixNulls();
