import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Logout from './Logout'

function Dashboard() {
  return (
    <div>
        <h1>This is the dashboard </h1>
<button>
    <Link to="/Logout"   > LOGOUT</Link>
</button>
<button><Link to="/Admin"   > users</Link></button>

    </div>
  )
}

export default Dashboard