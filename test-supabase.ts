import { supabase } from './services/supabaseClient';
import DatabaseService from './services/databaseService';

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');

  console.log('1. Testing direct Supabase client connection...');
  const { data: healthCheck, error: healthError } = await supabase
    .from('users')
    .select('count')
    .limit(1);

  if (healthError) {
    console.error('❌ Direct connection failed:', healthError.message);
    return;
  }
  console.log('✅ Direct connection successful\n');

  console.log('2. Testing DatabaseService.getUserByEmail...');
  const testUser = await DatabaseService.getUserByEmail('teacher@example.com');
  if (testUser) {
    console.log('✅ Found test user:', testUser);
  } else {
    console.log('⚠️  No test user found. Creating sample data...');
    
    const newUser = await DatabaseService.createUser({
      email: 'test@example.com',
      name: 'Test User',
      role: 'STUDENT' as any
    });
    
    if (newUser) {
      console.log('✅ Created test user:', newUser);
    } else {
      console.error('❌ Failed to create test user');
    }
  }

  console.log('\n3. Testing class operations...');
  const { data: classes, error: classError } = await supabase
    .from('classes')
    .select('*')
    .limit(5);

  if (classError) {
    console.error('❌ Failed to fetch classes:', classError.message);
  } else {
    console.log(`✅ Found ${classes?.length || 0} classes`);
    if (classes && classes.length > 0) {
      console.log('Sample class:', classes[0]);
    }
  }

  console.log('\n✨ Supabase connection test completed!');
}

testSupabaseConnection().catch(console.error);
